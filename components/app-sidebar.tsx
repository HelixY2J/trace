"use client"

import * as React from "react"
import { ArchiveX, Command, File, Send, Trash2, Search, History, Briefcase, ImagePlus, Video, Box, Sparkles, Images, CircleHelp, Type, Camera, Play, Download, FileUp, Save } from "lucide-react"
import Image from "next/image"
import ActionCard from "./ActionCard"

import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"


type AddHandler = (kind: "text" | "image" | "llm") => void
type ExportHandler = () => void
type ImportHandler = (file: File) => void
type SaveDbHandler = () => void
type LoadDbHandler = () => void


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
      isActive: true,
    },
    {
      title: "Quick Access",
      url: "#",
      icon: History,
      isActive: false,
    },
    {
      title: "Toolbox",
      url: "#",
      icon: Briefcase,
      isActive: false,
    },
    {
      title: "Image Models",
      url: "#",
      icon: ImagePlus,
      isActive: false,
    },
    {
      title: "Video Models",
      url: "#",
      icon: Video,
      isActive: false,
    },
    {
      title: "3D Models",
      url: "#",
      icon: Box,
      isActive: false,
    },
    {
      title: "My Models",
      url: "#",
      icon: Sparkles,
      isActive: false,
    },
  ],
}

export function AppSidebar({ onAdd, onExport, onImport, onSaveDb, onLoadDb, ...props }: React.ComponentProps<typeof Sidebar> & { onAdd?: AddHandler; onExport?: ExportHandler; onImport?: ImportHandler; onSaveDb?: SaveDbHandler; onLoadDb?: LoadDbHandler }) {

  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { setOpen, open } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)] !border-0 bg-[#212126] text-[#e8edf0]"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        if (activeItem?.title === item.title) {
                          // Toggle sidebar when re-clicking the active icon
                          setOpen(!open)
                        } else {
                          // Activate item and ensure sidebar opens
                          setActiveItem(item)
                          setOpen(true)
                        }
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2 data-[active=true]:bg-[#F7FFA8] data-[active=true]:text-[#0f0f13]"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col items-center gap-2 py-2">
            <button
              type="button"
              aria-label="Open images"
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-md"
            >
              <Images className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Help"
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-md"
            >
              <CircleHelp className="size-4" />
            </button>
            <div className="mt-1">
              <Image
                src="/logo/discord.svg"
                alt="Discord"
                width={28}
                height={28}
                priority
              />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden w-auto !border-0 bg-[#212126] text-[#e8edf0] md:flex md:flex-1 md:overflow-x-hidden">
        <SidebarHeader className="gap-3.5 border-b border-[#353539] bg-[#212126] p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
          </div>
          <SidebarInput
            placeholder="Search"
            className="bg-[#2a2a2f] text-[#e8edf0] placeholder:text-zinc-500 border-[#353539] focus-visible:border-[#F7FFA8] focus-visible:ring-[#F7FFA8]/40"
          />
        </SidebarHeader>
        <SidebarContent className="bg-[#212126]">
          {onAdd && (
            <SidebarGroup className="px-4 pt-4">
              <Label className="mb-2 text-xs text-zinc-400">Quick Access</Label>
              <div className="flex flex-col gap-2">
                <ActionCard icon={<Type className="size-5" />} label="Prompt" onClick={() => onAdd("text")} dragKind="text" />
                <ActionCard icon={<Camera className="size-5" />} label="Image" onClick={() => onAdd("image")} dragKind="image" />
                <ActionCard icon={<Play className="size-5" />} label="Imagen 4" onClick={() => onAdd("llm")} dragKind="llm" />
              </div>
            </SidebarGroup>
          )}
          {/* Toolbox divider and actions */}
          <SidebarGroup className="px-4 pt-4">
            <div className="border-[#353539] my-2 h-px w-full border-t" />
            <Label className="mb-2 text-xs text-zinc-400">Toolbox</Label>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <ActionCard icon={<Download className="size-5" />} label="Import workflow" />
                <input
                  type="file"
                  accept="application/json"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    onImport?.(file);
                    e.currentTarget.value = "";
                  }}
                />
              </div>
              {/* Export as ActionCard */}
              <ActionCard
                icon={<FileUp className="size-5" />}
                label="Export workflow"
                onClick={() => onExport?.()}
              />
            </div>
          </SidebarGroup>
          <SidebarGroup className="px-4 pt-4">
            <div className="border-[#353539] my-2 h-px w-full border-t" />
            <Label className="mb-2 text-xs text-zinc-400">Database</Label>
            <div className="flex flex-col gap-2">
              <ActionCard icon={<Save className="size-5" />} label="Save to DB" onClick={() => onSaveDb?.()} />
              <ActionCard icon={<Download className="size-5" />} label="Load from DB" onClick={() => onLoadDb?.()} />
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
